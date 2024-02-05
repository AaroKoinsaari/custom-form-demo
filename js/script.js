$(document).ready(function () {
    let fieldCount = 0;  // Keep track of added fields

    // Adds text field
    $('#add-text').click(function () {
        fieldCount++;
        addTextField(fieldCount);
    });

    // Adds selection field
    $('#add-select').click(function () {
        fieldCount++;
        addSelectField(fieldCount);
    });

    // Adds new text field
    function addTextField(count) {
        const $div = $('<div>')
            .addClass('field-wrapper')
            .attr('id', `field-${count}`);

        const $inputHeader = $('<input>').attr({
            type: 'text',
            name: `header-text-${count}`,
            placeholder: `Header ${count}`
        });

        const $inputValue = $('<input>').attr({
            type: 'text',
            name: `value-text-${count}`,
            placeholder: `Value ${count}`
        });

        const $removeButton = $('<button>')
            .attr('type', 'button')
            .addClass('remove-field')
            .text('Remove');

        $removeButton.click(function () {
            $(this).closest('.field-wrapper').remove();
            updateCount();
        });

        $div.append($inputHeader, $inputValue, $removeButton);
        $('#form-container').append($div);
    }

    // Adds new selection field
    function addSelectField(count) {
        const $div = $('<div>')
            .addClass('field-wrapper')
            .attr('id', `field-${count}`);

        const $selectHeader = $('<input>').attr({
            type: 'text',
            name: `select-header-${count}`,
            placeholder: `Select Header ${count}`
        });

        const $select = $('<select>').attr({
            name: `select-${count}`
        }).append(
            $('<option>', { value: 'yes', text: 'Yes' }),
            $('<option>', { value: 'no', text: 'No' })
        );

        const $removeButton = $('<button>')
            .attr('type', 'button')
            .addClass('remove-field')
            .text('Remove');

        // Removes the specified field
        $removeButton.click(function () {
            $(this).closest('.field-wrapper').remove();
            updateCount();
        });

        $div.append($selectHeader, $select, $removeButton);
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