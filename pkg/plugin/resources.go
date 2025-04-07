package plugin


import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
)


// handlePing is an example HTTP GET resource that returns a {"message": "ok"} JSON response.
func (a *App) handlePing(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	if _, err := w.Write([]byte(`{"message": "ok"}`)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// handleEcho is an example HTTP POST resource that accepts a JSON with a "message" key and
// returns to the client whatever it is sent.
func (a *App) handleEcho(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode incoming JSON
	var body struct {
		Message string `json:"message"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Marshal the same body to forward
	payload, err := json.Marshal(body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	pluginCtx := httpadapter.PluginConfigFromContext(req.Context())
	backend.Logger.Debug("Debug msg Settings:", pluginCtx.AppInstanceSettings.JSONData, 1)

	var data map[string]interface{}
	err = json.Unmarshal(pluginCtx.AppInstanceSettings.JSONData, &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	a.server = data["apiUrl"].(string)

	// Forward to remote API
	resp, err := http.Post(a.server, "application/json", bytes.NewBuffer(payload))
	if err != nil {
		http.Error(w, err.Error() + a.server, http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Mirror remote status code
	w.WriteHeader(resp.StatusCode)

	// Copy the response body from the remote API directly to the client
	io.Copy(w, resp.Body)

	/*
	w.Header().Add("Content-Type", "application/json")
	if _, err := w.Write(payload); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	*/
}

// registerRoutes takes a *http.ServeMux and registers some HTTP handlers.
func (a *App) registerRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/ping", a.handlePing)
	mux.HandleFunc("/echo", a.handleEcho)
}
