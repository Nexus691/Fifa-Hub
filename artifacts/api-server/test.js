const axios = require('axios');
axios.get('https://worldcup26.ir/get/games').then(r => console.log("SUCCESS:", r.data)).catch(e => console.log("ERROR:", e.message));
