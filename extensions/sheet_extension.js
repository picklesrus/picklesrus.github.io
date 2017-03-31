/* Extension demonstrating a blocking command block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */

new (function() {
    var ext = this;

    function initStuff() {
      var fetchedSheet_ = null;
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_sheet = function(sheet_id, api_key, callback) {
        // Copy pasting into the blocks without extraneous whitespace is hard
        // so remove it here.
        sheet_id = sheet_id.trim();
        api_key = api_key.trim();

        // TODO: This fetches from A-Z. We'll have to refetch later
        // if it is bigger.
        var r = 'A1:Z';
        var url = 'https://sheets.googleapis.com/v4/spreadsheets/'+
        sheet_id + '/values/'+r +'/?key='+api_key;

        $.ajax({
              url: url,
              dataType: 'jsonp',
              success: function(sheet_data) {
                  // Deal with spreadsheets with multiple sheets?
                  currentSheetId_ = sheet_id;
                  fetchedSheet_ = sheet_data;
                  key_ = api_key;
                  console.log(sheet_data);
                  callback();
              }
        });
        console.log('getting sheet');
    };
    ext.num_cols = function(callback) {
        if (!fetchedSheet_) {
            console.log('sorry, no sheet yet. so no colums');
            return 0;
        }
        // Assuming major dimension ROW.
        // WATCH OUT: assumes and that the number of columns in the sheet
        // is the number of columns in the first row containing data.
        return fetchedSheet_.values[0].length;
    };

    ext.num_rows = function(callback) {
        if (!fetchedSheet_) {
            console.log('sorry, no sheet yet. so no rows');
            return 0;
        }
        // Assuming the major dimension was rows. If not, fix.
        return fetchedSheet_.values.length;
    };

    ext.cell_value = function(cell_value, callback) {
        if (!fetchedSheet_) {
            console.log('sorry no sheet so no data');
            return '';
        }
        var A1regex = /([A-Z]+)([0-9]+)/i;
        var match = cell_value.match(A1regex);
        if (!match || match.length < 3) {
          console.log('cannot parse cell value: ' + cell_value);
          return '';
        }
        var column = match[1];
        // Allow specifying cell values as lower case. e.g. c4 vs C4.
        column = column.toUpperCase();
        var row = match[2];
        if (!row || !column) {
            console.log('cannot parse cell value: ' + cell_value);
            return '';
        }
        // Convert from letter to array index.  Subtract 10 instead of 9
        // since the columns are 1 indexed.
        var columnNum = parseInt(column, 36) - 10;
        row = row - 1;
        var val = fetchedSheet_.values[row][columnNum];
        return val;
    };


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'get sheet by url: %s api_key: %s', 'get_sheet'],
            ['r', 'number of rows', 'num_rows'],
            ['r', 'number of columns', 'num_cols'],
            ['r', 'get value from cell %s', 'cell_value'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('sheet extension', descriptor, ext);
})();