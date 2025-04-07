package plugin

/*
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// Define a struct that matches the JSON structure
type ResponseData struct {
	Message string `json:"message"`
	User    string `json:"user"`
}

func main() {
	// Step 1: Make the HTTP GET request
	resp, err := http.Get("https://example.com/api/hello")
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	// Step 2: Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading body:", err)
		return
	}

	// Step 3: Unmarshal JSON into Go struct
	var data ResponseData
	err = json.Unmarshal(body, &data)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	// Step 4: Use the parsed data
	fmt.Println("User:", data.User)
	fmt.Println("Message:", data.Message)
}

*/

