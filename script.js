/**
 * Initializes dynamic form which allows users to add, edit, and remove text and select fields.
 * Updates field identifiers and validates form before submitting it.
 * Displays the form data on a table next to it after submission.
 */
$(document).ready(function () {
    let fieldCount = 0;  // Keeps track of added fields

    // Tracks the ID of the timeout for form messages, 
    // to allow cancellation or reset of message display timer
    let messageTimeoutId;


    // Event handler for adding a text input field to the form
    $('#add-text').click(() => {
        fieldCount++;
        addField("text", fieldCount);
    });

    // Event handler for adding a selection dropdown field to the form
    $('#add-select').click(() => {
        showSelectOptionsModal().then(options => {
            // console.log(options);
            if (options) {
                fieldCount++;
                addField("select", fieldCount, options);
            }
        });
    });

    /**
     * Dynamically adds a new field of the specified type to the form.
     * 
     * @param {string} type The type of field to add (text or select).
     * @param {number} count The ordinal number of the field.
     * @param {Array} [options] The options for select fields. Default empty array.
     */
    function addField(type, count, options = []) {
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
        }

        if (type === "select") {
            $field = $('<select>').attr({
                name: `${type}-value-${count}`
            });
            // Append options provided by the user
            options.forEach(option => {
                $field.append($('<option>', {
                    value: option.value,
                    text: option.text
                }));
            });
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

    /**
     * Shows a modal window for users to input options for a select field.
     * 
     * @returns {Promise<Array>} A promise that resolves with an array of option objects
     * containing the value and text for each option added by the user.
     */
    function showSelectOptionsModal() {
        return new Promise((resolve) => {
            // Display the modal window
            $('#selectOptionsModal').show();

            // Clear previous input fields
            $('#optionInputs').empty().append(
                '<input type="text" placeholder="Option text" class="option-input" /><br>',
                '<input type="text" placeholder="Option text" class="option-input" /><br>'
            );

            // Handle Add Option button click
            $('#addOption').off('click').on('click', function () {
                // Append a new input field for the option
                $('<input>', {
                    type: 'text',
                    placeholder: 'Option text',
                    class: 'option-input'
                }).appendTo('#optionInputs').after('<br>');
            });

            // Handle Save button click
            $('#saveOptions').off('click').on('click', function () {
                // Collect all options
                const options = $('.option-input').map(function () {
                    const value = $(this).val().trim();
                    // Create an option object if the field has text
                    return value ? { value: value, text: value } : null;
                }).get().filter(option => option !== null); // Remove null values

                // Check if user made any custom options
                if (options.length === 0) {
                    const firstInput = $('.option-input').first();
                    setAndReportValidity(firstInput[0], 'Please add at least one option.');
                } else {  // Hide the modal and return options
                    $('#selectOptionsModal').hide();
                    resolve(options);
                }
            });

            // Close modal window by pressing X
            $('.close-button').click(function () {
                $('#selectOptionsModal').hide();
            });
        });
    }

    /**
     * Sets a custom validity message for a form element and displays it.
     * 
     * @param {HTMLElement} element The form element to which the custom validity message is displayed.
     * @param {string} message The custom validity message to display.
     */
    function setAndReportValidity(element, message) {
        element.setCustomValidity(message);
        element.reportValidity();

        // Clear custom validity upon correction to make sure user can correct the error
        $(element).on('input', function () {
            this.setCustomValidity('');
        });
    }

    /**
     * Click event listener to edit-header elements in the form.
     * Enables editing of headers by replacing them with a text input field.
     */
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

        // Replace the header with a temporary input for editing
        originalElement.replaceWith(tempInput);
        tempInput.focus().select();

        /**
         * Handles blur and Enter-button press events for the temporary input field.
         * Validates the input value and updates the original header element or maintains focus for correction.
         * 
         * @param {Event} e The event object.
         */
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

    /**
     * Reindexes fields to maintain sequential order and updates the global field count.
     */
    function updateCount() {
        $('.field-wrapper').each(function (index) {
            const newIndex = index + 1;  // New index representing the visual order
            $(this).attr('id', `field-${newIndex}`);

            // Check if the header has been edited by comparing its text with the default "Header ${index}"
            const $editHeader = $(this).find('.edit-header');
            const currentHeaderText = $editHeader.text();
            const isEdited = !currentHeaderText.startsWith(`Header `) || parseInt(currentHeaderText.split(' ')[1]) !== newIndex;

            // Only update the header text if it has not been edited by the user
            if (!isEdited) {
                $editHeader.text(`Header ${newIndex}`);
            }

            // Update the name and placeholder for input or select elements
            $(this).find('input[type="text"], select').each(function () {
                const isInput = $(this).is('input');
                const fieldName = isInput ? `text-value-${newIndex}` : `select-value-${newIndex}`;
                const fieldPlaceholder = isInput ? `Value ${newIndex}` : '';
                $(this).attr({
                    name: fieldName,
                    placeholder: fieldPlaceholder
                });
            });
        });

        // Update fieldCount based on current fields
        fieldCount = $('.field-wrapper').length;
    }

    /**
     * Handles form submission, validation, and sends data using AJAX request.
     */
    $('#submit-form').click(function (e) {
        e.preventDefault();
        if (!validateFormFields()) {
            return;
        }
        const formData = collectFormData();

        // Check that there is data in the form to be sent
        if (Object.keys(formData).length === 0) {
            console.log('Form is empty, not submitting.');
            displayFormMessage('Cannot submit empty form.', 'error')
            return;
        }

        // Send form data to the server using AJAX
        $.ajax({
            url: '/submit-form',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ fields: formData }),  // Convert to JSON format
            success: function (response) {  // Successful submission
                console.log('Data submitted successfully: ', response);
                displayFormMessage('Data submitted successfully.', 'success');
                generateTable(formData);
                resetForm();
            },
            error: function (error) {  // Unsuccessful submission
                console.error('Error submitting the form: ', error)
                displayFormMessage('Error submitting the form.', 'error');
                resetForm();
            }
        });
    });

    /**
     * Displays a message inside the form container to provide feedback to the user.
     *
     * @param {string} message The message text to be displayed.
     * @param {string} type The type of the message ('success' or 'error').
     */
    function displayFormMessage(message, type) {
        const messageContainer = $('#form-message');
        messageContainer.text(message).removeClass('success error').addClass(type).show();

        // Cancel the previous timer if it exists
        clearTimeout(messageTimeoutId);

        // Set a new timer and store its ID
        messageTimeoutId = setTimeout(() => {
            messageContainer.hide();
        }, 5000);
    }

    /**
     * Validates all dynamic fields in the form before submission.
     * Checks for empty text inputs or unselected select options, 
     * and displays custom validity message for invalid input.
     * 
     * @returns {boolean} True if all fields are valid, false otherwise.
     */
    function validateFormFields() {
        let isValid = true;

        // Reset custom validity messages before re-validation
        $('.field-wrapper .temp-input').each(function () {
            this.setCustomValidity('');
        });

        // Validate each field-wrapper individually
        $('.field-wrapper').each(function () {
            // Get header text from input if editing, else from static text.
            const headerInput = $(this).find('.temp-input').get(0);
            const header = headerInput ? headerInput.value.trim() : $(this).find('.edit-header').text().trim();

            // Get value text from input
            const valueElement = $(this).find('input[type="text"], select').last().get(0);
            const value = $(valueElement).val();

            // Check header validity
            if (!validateText(header)) {
                setAndReportValidity(headerInput || valueElement, 'This field cannot be empty');
                isValid = false;
                return false; // Stop validation if any header is invalid
            }

            // Check value validity
            if (!validateText(value)) {
                setAndReportValidity(valueElement, 'This field cannot be empty');
                isValid = false;
                return false; // Stop validation if any value field is invalid
            }
        });

        return isValid;
    }

    /**
     * Validates that a text input's value is not empty.
     * 
     * @param {string} value The value of the text input to validate.
     * @returns {boolean} True if the value is not empty, false otherwise.
     */
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

    /**
     * Generates and displays a table based on the submitted form data.
     * 
     * @param {Object} formData The collected data from the form.
     */
    function generateTable(formData) {
        var $tableContent = $('#table-content');
        $tableContent.empty(); // Empty previous table

        // Create new table
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
        $tableContent.append($table);
    }

    /**
     * Resets the dynamic form to its initial state, clears
     * all dynamically added fields and resets the field counter.
     */
    function resetForm() {
        $('#form-container').find('.field-wrapper').remove();
        fieldCount = 0;
    }
});
