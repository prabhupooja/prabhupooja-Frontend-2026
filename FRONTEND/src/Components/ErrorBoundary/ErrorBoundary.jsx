import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "linear-gradient(135deg, #fffaf5 0%, #fff3e0 100%)",
            fontFamily: "'Poppins', sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "40px 30px",
              maxWidth: "500px",
              boxShadow: "0 10px 40px rgba(234, 88, 12, 0.12)",
              border: "1px solid #fed7aa",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🙏</div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#9a3412",
                marginBottom: "12px",
              }}
            >
              कुछ तकनीकी समस्या आई है
            </h2>
            <p
              style={{
                fontSize: "14.5px",
                color: "#64748b",
                lineHeight: "1.6",
                marginBottom: "28px",
              }}
            >
              कृपया पेज को रीलोड करें या होमपेज पर लौटें। हमारी टीम आपकी सेवा के लिए तत्पर है।
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "12px 24px",
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                🔄 Refresh Page
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "14px",
                  boxShadow: "0 4px 14px rgba(234, 88, 12, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                🏠 Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
