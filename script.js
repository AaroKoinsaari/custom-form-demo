/**
 * Initializes dynamic form which allows users to add, edit, and remove text and select fields.
 * Updates field identifiers and validates form before submitting it.
 * Displays the form data on a table next to it after submission.
 */
$(document).ready(function () {
    let fieldCount = 0;  // Keeps track of added fields

    // Add a text input field
    $('#add-text').click(() => {
        fieldCount++;
        addField("text", fieldCount);
    });

    // Add a selection dropdown field
    $('#add-select').click(() => {
        fieldCount++;
        addField("select", fieldCount);
    });

    // Adds new field by given type
    function addField(type, count) {
        const $div = $('<div>')
            .addClass('field-wrapper')
            .attr('id', `field-${count}`);

        const $label = $('<label>')  // Header element
            .attr({
                class: 'edit-header',
                tabindex: '0'
            })
            .text(`Header ${count}`);

        let $field; // Field that is created dynamically by the type
        if (type === "text") {
            $field = $('<input>').attr({
                type: 'text',
                name: `${type}-value-${count}`,
                placeholder: `Value ${count}`
            });
        } else {
            $field = $('<select>').attr({
                name: `${type}-value-${count}`
            }).append($('<option>', {
                value: 'yes',
                text: 'Yes'
            }), $('<option>', {
                value: 'no',
                text: 'No'
            }));
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
        $div.append($removeButton, $label, $field);
        $('#dynamic-form').append($div);
    }

    // Set and display custom validity message for an element
    function setAndReportValidity(element, message) {
        element.setCustomValidity(message);
        element.reportValidity();

        // Clear custom validity upon correction to make sure user can correct the error
        $(element).on('input', function () {
            this.setCustomValidity('');
        });
    }

    // Handle click events on input fields within the form
    $('#dynamic-form').on('click', '.edit-header', function () {
        const originalElement = $(this);
        const currentText = originalElement.text();
        const tempInput = $('<input>', {
            type: 'text',
            class: 'temp-input',
            value: currentText,
            blur: handleInputEvents,
            keydown: handleInputEvents
        });

        originalElement.replaceWith(tempInput);
        tempInput.focus().select();

        function handleInputEvents(e) {
            if (e.type === 'blur' || e.key === 'Enter') {
                e.preventDefault();
                const newText = tempInput.val().trim();

                if (newText === '') {
                    setAndReportValidity(tempInput[0], 'This field cannot be empty');
                    tempInput.focus();  // Keep focus on the input for correction
                } else {
                    // Update the header with new text and convert back to the original element
                    originalElement.text(newText);
                    tempInput.replaceWith(originalElement);
                }
            }
        }
    });

    // Updates field count and re-indexes fields
    function updateCount() {
        $('.field-wrapper').each(function (index) {
            const newIndex = index + 1;  // New index representing the visual order
            $(this).attr('id', `field-${newIndex}`);
            const $editHeader = $(this).find('.edit-header');
            // Update the number to reflect new sequence number
            $editHeader.text(`Header ${newIndex}`);

            $(this).find('input[type="text"]').first().attr({
                name: `header-text-${newIndex}`,
                placeholder: `Header ${newIndex}`
            });
            $(this).find('input[type="text"], select').last().attr({
                name: `value-text-${newIndex}`, // Update for both text and select
                placeholder: `Value ${newIndex}` // Placeholder update only applies to text inputs
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

    // Validates fields when saving
    function validateFormFields() {
        let isValid = true;

        // Reset custom validity messages before re-validation
        $('.field-wrapper input, .field-wrapper select').each(function () {
            this.setCustomValidity('');
        });

        $('.field-wrapper').each(function () {
            const header = $(this).find('.edit-header').text();
            const element = $(this).find('input[type="text"], select').last().get(0); // Get DOM element
            const value = $(element).val();

            // Set and show custom validity if the value is invalid
            if (!validateText(header) || !validateText(value)) {
                setAndReportValidity(element, 'This field cannot be empty');
                isValid = false;
                return false;  // Exit the loop early if any field is invalid
            }
        });

        return isValid;
    }

    // Helper function to validate text inputs
    function validateText(value) {
        return value.trim() !== '';
    }

    // Collects form data
    function collectFormData() {
        const formData = {};
        $('.field-wrapper').each(function () {
            const header = $(this).find('.edit-header').text();
            const value = $(this).find('input[type="text"], select').last().val();
            formData[header] = value;
        });
        return formData;
    }

    // Genearates table from the data
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
