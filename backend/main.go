// ----------- backend/main.go -----------
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// Simple cache entry
type cacheEntry struct {
	Data      json.RawMessage
	ExpiresAt time.Time
}

var (
	cache   = map[string]cacheEntry{}
	cacheMu sync.RWMutex
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println(".env file not found, reading from system environment")
	}
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	if apiKey == "" {
		log.Fatal("Please set OPENWEATHER_API_KEY environment variable")
	}

	r := gin.Default()

	// Allow frontend during dev. In production, lock origins down.
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods: []string{"GET"},
		AllowHeaders: []string{"Content-Type"},
		MaxAge:       12 * time.Hour,
	}))

	// Basic endpoint: /weather?city=London
	r.GET("/weather", func(c *gin.Context) {
		city := c.Query("city")
		lat := c.Query("lat")
		lon := c.Query("lon")
		if city == "" && (lat == "" || lon == "") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "please provide city OR lat & lon"})
			return
		}

		// Build cache key
		key := city
		if key == "" {
			key = lat + "," + lon
		}

		// Try cache
		cacheMu.RLock()
		entry, ok := cache[key]
		cacheMu.RUnlock()
		if ok && time.Now().Before(entry.ExpiresAt) {
			// Return cached JSON
			var obj interface{}
			if err := json.Unmarshal(entry.Data, &obj); err == nil {
				c.JSON(http.StatusOK, obj)
				return
			}
		}

		// Fetch from OpenWeatherMap
		var url string
		if city != "" {
			url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric"
		} else {
			url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric"
		}

		resp, err := http.Get(url)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": "failed fetching upstream"})
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			c.JSON(resp.StatusCode, gin.H{"error": "upstream status: " + resp.Status})
			return
		}

		var raw json.RawMessage
		if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid upstream response"})
			return
		}

		// Cache for 2 minutes
		cacheMu.Lock()
		cache[key] = cacheEntry{Data: raw, ExpiresAt: time.Now().Add(2 * time.Minute)}
		cacheMu.Unlock()

		var obj interface{}
		json.Unmarshal(raw, &obj)
		c.JSON(http.StatusOK, obj)
	})

	// Simple health
	r.GET("/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status": "ok"}) })

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("listening on :%s\n", port)
	r.Run(":" + port)
}
