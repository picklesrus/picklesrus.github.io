/* Extension demonstrating a blocking command block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */

new (function() {
    var ext = this;

    function initStuff() {
      var fetchedSheet_ = null;
      var currentColumn_ = null;
      var currentRow_ = null;
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
                  currentColumn_ = 0;
                  currentRow_ = 0;
                  console.log(sheet_data);
                  callback();
              }
        });
        console.log('getting sheet');
    };
     ext.set_row = function(rowNum, callback) {
        // -1 so since rows in the actual spreadsheet start at 1.
        currentRow_ = rowNum - 1;
    };
    
    ext.set_column = function(columnNum, callback) {
        // Convert from letter to array index.  Subtract 10 instead of 9
        // since the columns are 1 indexed.
        // TODO: handle parsing after column Z (e.g. CC)
        var temp = parseInt(columnNum, 36) - 10;
        currentColumn_ = temp;
        
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

    ext.next_row = function(callback) {
        if (!fetchedSheet_) {
            console.log('sorry, no sheet yet. so no rows');
            return 0;
        }
        currentRow_++;
        if (currentRow_ > numRows()) {
            currentRow_ = 0;
            console.log('loop back around');
        }
        console.log('next column:' + currentRow_);
    };

    ext.next_column = function(callback) {
        if (!fetchedSheet_) {
            console.log('sorry, no sheet yet. so no columns');
            return 0;
        }
        currentColumn_++;
        console.log('next column:' + currentColumn_);
    };
    ext.reset_column = function(callback) {
        if (!fetchedSheet_) {
            console.log('sorry, no sheet yet. so no columns');
            return 0;
        }
        currentColumn_ = 0;
    };
    ext.reset_row = function(callback) {
        if (!fetchedSheet_) {
            console.log('sorry, no sheet yet. so no columns');
            return 0;
        }
        currentRow_ = 0;
    };

    ext.current_value = function(callback) {
        if (!fetchedSheet_) {
            console.log('sorry no sheet so no data');
            return '';
        }
        var val = fetchedSheet_.values[currentRow_][currentColumn_];
        return val;
    };



    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'get sheet by id: %s api_key: %s', 'get_sheet', '1Ww0F901GvQL_dW--FIUFHiLV4xJT-QHlVhyQxz6iVWI'],
            [' ', 'next column', 'next_column'],
            [' ', 'next row', 'next_row'],
            ['r', 'number of rows', 'num_rows'],
            ['r', 'number of columns', 'num_cols'],
            ['r', 'current value', 'current_value'],
            [' ', 'set column to %s', 'set_column', 'A'],
            [' ', 'set row to %n', 'set_row', 1],
        ]
    };

    // Register the extension
    ScratchExtensions.register('sheet extension', descriptor, ext);
})();