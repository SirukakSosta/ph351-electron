/// <reference lib="webworker" />
 
addEventListener('message', ({ data }) => {
   postMessage('output');
}) 