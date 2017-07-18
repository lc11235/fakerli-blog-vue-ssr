/**
 * eslint - disable
 */
require('eventsource-polyfill');
const hotClient = require('webpack-hot-middleware/client?noinfo=true&reload=true');

hotClient.subscribe(function(event){
    if(event.action === 'reload'){
        window.location.reload();
    }
});