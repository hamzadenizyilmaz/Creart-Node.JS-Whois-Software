export default function handler(req, res) {
  // API route health check
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'WHOIS Lookup API is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }
}