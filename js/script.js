$(document).ready(function () {
    let fieldCount = 0;  // Keep track of added fields

    $('#add-text').click(function () {
        console.log("Add text field clicked!")

        fieldCount++;
        const div = $('<div>').addClass('field-wrapper').attr('id', `field-${fieldCount}`);
        const inputHeader = $('<input>').attr({
            type: 'text',
            name: `header-text-${fieldCount}`,
            placeholder: `Header ${fieldCount}`
        });

        const inputValue = $('<input>').attr({
            type: 'text',
            name: `value-text-${fieldCount}`,
            placeholder: `Value ${fieldCount}`
        });

        const removeButton = $('<button>')
            .attr('type', 'button')
            .addClass('remove-field')
            .text('Remove')
            .data('id', fieldCount);

        div.append(inputHeader, inputValue, removeButton);
        $('#form-container').append(div);
    })

    $('#form-container').on('click', '.remove-field', function () {
        const fieldId = $(this).data('id');
        $(`#field-${fieldId}`).remove();
        // TODO: update the field count
    });
});