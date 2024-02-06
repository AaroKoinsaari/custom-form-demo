$(document).ready(function () {
    let fieldCount = 0;  // Keep track of added fields

    // Adds text field
    $('#add-text').click(function () {
        fieldCount++;
        addField("text", fieldCount);
    });

    // Adds selection field
    $('#add-select').click(function () {
        fieldCount++;
        addField("select", fieldCount);
    });

    // Adds new field based on the type given as parameter
    function addField(type, count) {
        const $div = $('<div>')
            .addClass('field-wrapper')
            .attr('id', `field-${count}`);

        let $field; // Field that is created dynamically by the type

        // General input-header for all types
        const $header = $('<input>').attr({
            type: 'text',
            name: `${type}-header-${count}`,
            placeholder: `Header ${count}`
        });

        if (type === "text") {
            $field = $('<input>').attr({
                type: 'text',
                name: `${type}-value-${count}`,
                placeholder: `Value ${count}`
            });
        } else if (type === "select") {
            $field = $('<select>')
                .attr({ name: `${type}-value-${count}` })
                .append($('<option>', { value: 'yes', text: 'Yes' }),
                    $('<option>', { value: 'no', text: 'No' }));
        }

        const $removeButton = $('<button>')
            .attr('type', 'button')
            .addClass('remove-field')
            .text('Remove')
            .click(function () {
                $(this).closest('.field-wrapper').remove();
                updateCount();
            });

        // Add all elements to div
        $div.append($header, $field, $removeButton);
        $('#form-container').append($div);
    }

    // Update field count and re-index fields
    function updateCount() {
        $('.field-wrapper').each(function (index) {
            $(this).attr('id', `field-${index + 1}`);
            $(this).find('input[type="text"]').first().attr({
                name: `header-text-${index + 1}`,
                placeholder: `Header ${index + 1}`
            });
            $(this).find('input[type="text"], select').last().attr({
                name: `value-text-${index + 1}`, // Update for both text and select
                placeholder: `Value ${index + 1}` // Placeholder update only applies to text inputs
            });
        });
        // Update fieldCount based on current fields
        fieldCount = $('.field-wrapper').length;
    }

    // Handle form submit
    $('#submit-form').click(function (e) {
        e.preventDefault();
        var formData = {};
        $('.field-wrapper').each(function () {
            const header = $(this).find('input[type="text"]').val();
            const value = $(this).find('input[type="text"], select').last().val();
            formData[header] = value;
        });

        console.log(formData);

        // Clear the form and reset the field count
        $('#form-container').find('.field-wrapper').remove();
        fieldCount = 0;

        // Generate new table
        var $table = $('<table>').addClass('table-wrapper');
        var $thead = $('<thead>')
            .append($('<tr>')
                .append($('<th>')
                    .text('Field Name'),
                    $('<th>').text('Value')));
        var $tbody = $('<tbody>');

        $.each(formData, function (field, value) {
            var $row = $('<tr>')
                .append($('<td>')
                    .text(field),
                    $('<td>').text(value));
            $tbody.append($row);
        });

        // Compile and add the table to the container
        $table.append($thead, $tbody);
        $('#table-container').empty().append($table);
    });
});