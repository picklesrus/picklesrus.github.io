/* Extension demonstrating a blocking command block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */

new (function() {
    var ext = this;

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.sheet_url = function(callback) {
        //wait = Math.random();
        console.log('getting sheet');
        window.setTimeout(function() {
            callback();
        }, wait*1000);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'get sheet by url: %s', 'sheet_url'],
            ['r', 'get value from cell', 'cell_value'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('sheet extension', descriptor, ext);
})();