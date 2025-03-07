module.exports = async (req, res) => {
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbz_k8V3ZtbVjYwC7QG_BibL7BczADVC_LSaGxTGIp1Mt_0HH2EtSt37NsPkmVNvDN7olA/exec';
  
    try {
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };