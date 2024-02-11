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

    function addField(type, count) {
        const $div = $('<div>')
            .addClass('field-wrapper')
            .attr('id', `field-${count}`);

        let $field; // Field that is created dynamically by the type

        // Create a header as an editable span element
        const $headerSpan = $('<span>')
            .attr({
                id: `${type}-header-${count}`,
                class: 'edit-header',
                tabindex: '0'
            })
            .text(`Header ${count}`)
            .on('click', function () {
                // Convert to textfield for editing
                const $input = $('<input>').attr({
                    type: 'text',
                    id: `${type}-header-${count}`,
                    name: `${type}-header`,
                    value: $(this).text() // Set existing text as value
                }).on('blur keydown', function (e) {
                    if (e.type === 'blur' || e.key === 'Enter') {
                        e.preventDefault();
                        // Update span to show the new value and convert back to text
                        $headerSpan.text($(this).val());
                        $(this).replaceWith($headerSpan);
                    }
                });

                $(this).replaceWith($input);
                $input.focus().select();
            });

        if (type === "text") {
            $field = $('<input>').attr({
                type: 'text',
                name: `${type}-value`,
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
            .text('X')
            .click(function () {
                $(this).closest('.field-wrapper').remove();
                updateCount();
            });

        // Add elements to div
        $div.append($removeButton, $headerSpan, $field); // Use $headerSpan instead of $header
        $('#dynamic-form').append($div);
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

    // Event handler for submit
    $('#submit-form').click(function (e) {
        e.preventDefault();

        if (!validateFormFields()) {
            return;
        }

        const formData = collectFormData();

        // Send form data to the server using AJAX
        $.ajax({
            url: '/submit-form',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ fields: formData }),  // Convert to JSON format
            success: function (response) {
                console.log('Data submitted successfully: ', response);
                // TODO: notify the user
            },
            error: function (xhr, status, error) {
                console.error('Error submitting the form: ', error)
                // TODO: notify the user
            }
        });

        // console.log(formData);
        generateTable(formData);
        resetForm();
    });

    // Function to validate form fields
    function validateFormFields() {
        let isValid = true;
        $('.field-wrapper').each(function () {
            const header = $(this).find('input[type="text"]').val();
            const value = $(this).find('input[type="text"], select').last().val();

            if (!validateText(header) || !validateText(value)) {
                alert('Please enter valid text for headers and values.');
                isValid = false;
                return false;
            }
        });
        return isValid;
    }

    // Validates text fields to not be empty or whitespace
    function validateText(value) {
        return value.trim() !== '';
    }

    // Collects form data
    function collectFormData() {
        const formData = {};
        $('.field-wrapper').each(function () {
            const header = $(this).find('input[type="text"]').val();
            const value = $(this).find('input[type="text"], select').last().val();
            formData[header] = value;
        });
        return formData;
    }

    function generateTable(formData) {
        var $table = $('<table>').addClass('table-wrapper');
        var $tbody = $('<tbody>');

        $.each(formData, function (header, value) {
            var $row = $('<tr>').append(
                $('<td>').text(header),
                $('<td>').text(value)
            );
            $tbody.append($row);
        });

        $table.append($tbody);
        $('#table-container').empty().append($table);
    }

    // Resets the form
    function resetForm() {
        $('#form-container').find('.field-wrapper').remove();
        fieldCount = 0;
    }
});