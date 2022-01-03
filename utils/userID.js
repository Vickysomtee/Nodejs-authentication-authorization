
// Function to generate the user ID
module.exports = generateId = (username) => {
  const name = [...username.split(" ").join("")]
  const date = [...Date.now().toString()]
  let userId= name[0] + name[1] + name[2]


  for ( let i = date.length -1; i >= date.length - 4; i--) {
    userId += date[i]
  }
return userId.toUpperCase()
}