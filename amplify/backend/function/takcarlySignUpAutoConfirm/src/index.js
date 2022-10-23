

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, _context, callback) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    event.response.autoConfirmUser = true;
    if (event.request.userAttributes.hasOwnProperty("email")) {
        event.response.autoVerifyEmail = true;
    }
    if (event.request.userAttributes.hasOwnProperty("phone_number")) {
        event.response.autoVerifyPhone = true;
    }
    callback(null, event);
};
