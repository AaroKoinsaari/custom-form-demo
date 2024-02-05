$(document).ready(function () {
    let fieldCount = 0;  // Keep track of added fields

    $('#add-text').click(function () {
        console.log("Add text field clicked!")

        fieldCount++;
        const div = $('<div>').addClass('field-wrapper').attr('id', `field-${fieldCount}`);
        const input = $('<input>').attr({
            type: 'text',
            name: `text-${fieldCount}`,
            placeholder: `Text field ${fieldCount}`
        });

        div.append(input);
        $('#form-container').append(div);
    })
});