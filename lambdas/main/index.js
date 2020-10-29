exports.handler = async (event) => {
  // Simulate a function error by sending a POST request with 'boom' in the body
  if (event.body.includes('boom')) {
    boom
  }

  return event.body
}
