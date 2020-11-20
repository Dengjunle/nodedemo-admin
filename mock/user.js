
  const users = {
    "entity":{
			"abbrCom":"",
			"areaCode":"",
			"companyName":"string",
			"headName":"",
			"id":"513116666677aaaaa2d6fe0ec6d5ecf0",
			"isHead":null,
			"isLock":0,
			"logoUrl":"string",
			"number":null,
			"qRcodeUrl":"http://127.0.0.1:9797/scan?key=hohaii7m24",
			"qRkey":"hohaii7m23",
			"role":"ROLE_SUPER",
			"templateId":"string",
			"templateName":"string",
			"userName":"admin"
		},
		"token":"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1MTMxMTY2NjY2NzdhYWFhYTJkNmZlMGVjNmQ1ZWNmMCIsInJvbGUiOiJST0xFX1NVUEVSIiwiaXNzIjoiZWNoaXNhbiIsImV4cCI6MTU5NzY1MTc1OSwiaWF0IjoxNTk3MDQ2OTU5fQ.AhMhvlG1ZjTWedIjkHQQ7c25JwFrA0g8XhGCtMUAarMYDh665TJcaWoD3K_W_pzeMri_3roSKKg9ysqqiPSsuA"
  }
  
  module.exports = [
    // user login
    {
      url: '/auth/login',
      type: 'post',
      response: config => {
        const { username } = config.body
        return {
          "apiCode":1200,
          "success":true,
          "msg":"成功！",
          "result":{
            ...users
          }
        }
      }
    }
  ]
  