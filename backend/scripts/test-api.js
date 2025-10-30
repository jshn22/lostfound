(async () => {
  try {
    const base = 'http://localhost:5000'
    const registerRes = await fetch(base + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Script User', email: 'scriptuser@example.com', password: 'ScriptPass123' })
    })
    const registerData = await registerRes.text()
    console.log('REGISTER status:', registerRes.status)
    console.log(registerData)

    const loginRes = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'scriptuser@example.com', password: 'ScriptPass123' })
    })
    const loginData = await loginRes.json()
    console.log('LOGIN status:', loginRes.status)
    console.log(loginData)

    if (!loginData.token) {
      console.error('No token returned; aborting')
      process.exit(1)
    }

    const token = loginData.token

    const itemRes = await fetch(base + '/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title: 'Scripted Lost Wallet', description: 'A wallet lost near testing area', status: 'lost', location: 'Test Lab', category: 'wallet' })
    })
    const itemData = await itemRes.json()
    console.log('CREATE ITEM status:', itemRes.status)
    console.log(itemData)

    process.exit(0)
  } catch (err) {
    console.error('ERROR', err)
    process.exit(1)
  }
})()
