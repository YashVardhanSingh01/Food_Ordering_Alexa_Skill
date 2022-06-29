/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const util = require('./util');

const MENUS = 
    {
        PIZZA_HUT: {
            MAIN_DISH: "pizza",
            SIDE_DISH: "garlic bread",
            DRINK: "Coca Cola"
        },
        BURGER_KING: {
            MAIN_DISH: "burger",
            SIDE_DISH: "french fries",
            DRINK: "Pepsi"
        }
        
    };

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Sure, which restaurants would you like to order from?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const GetAvailableRestaurantsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetAvailableRestaurantsIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'We have 2 restaurants available right now ! They are Pizza Hut and Burger King.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'GetMenuIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

let chosenRestaurant = '';
const GetMenuIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetMenuIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let speakOutput = 'I didn\'t quite catch that';
        if(intent.confirmationStatus === 'CONFIRMED'){
            const selectedRestaurant = Alexa.getSlotValue(requestEnvelope, 'restaurant');  
            chosenRestaurant = selectedRestaurant;
            speakOutput = `This is the menu at ${selectedRestaurant}: `;
            if(selectedRestaurant.toUpperCase() === 'PIZZA HUT'){
                speakOutput = speakOutput + `We have ${MENUS.PIZZA_HUT.MAIN_DISH}, ${MENUS.PIZZA_HUT.SIDE_DISH} and ${MENUS.PIZZA_HUT.DRINK}.` ;
            }
            else if(selectedRestaurant.toUpperCase() === 'BURGER KING'){
                speakOutput = speakOutput + `We have ${MENUS.BURGER_KING.MAIN_DISH}, ${MENUS.BURGER_KING.SIDE_DISH} and ${MENUS.BURGER_KING.DRINK}.` ;
            }
            else {
                speakOutput = speakOutput + 'Please select one of the available restaurants';
            }
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .addDelegateDirective({
                name: 'GetOrderIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};

const GetOrderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetOrderIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        const price_main = 50;
        const price_side = 30;
        const price_drink = 10;
        let speakOutput = 'I didn\'t catch that';
        if(intent.confirmationStatus === 'CONFIRMED'){
            const number_main = Alexa.getSlotValue(requestEnvelope, 'number_m');
            const number_side = Alexa.getSlotValue(requestEnvelope, 'number_s');
            const number_drink = Alexa.getSlotValue(requestEnvelope, 'number_d');
            const selectedMain = Alexa.getSlotValue(requestEnvelope, 'main_dish');
            const selectedSide = Alexa.getSlotValue(requestEnvelope, 'side_dish');
            const selectedDrink = Alexa.getSlotValue(requestEnvelope, 'drink');
            //chosenRestaurant = chosenRestaurant.toUpperCase();
            //chosenRestaurant = chosenRestaurant.split(' ').join('_');
            //if(selectedMain.toUpperCase() === MENUS.chosenRestaurant.MAIN_DISH.toUpperCase()){
             const price = (parseInt(number_main)*price_main) + (parseInt(number_side)*price_side) + (parseInt(number_drink)*price_drink);
            speakOutput = `Your finalised order is ${number_main} ${selectedMain}, ${number_side} ${selectedSide} with ${number_drink} ${selectedDrink}.
                            Total price is ${price} rupees. Your order will be ready shortly. Thank you for choosing ${chosenRestaurant}. `;   
            //}
            //else {
            //    speakOutput = `Please select a dish from ${chosenRestaurant} only`;
            //}
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetAvailableRestaurantsIntentHandler,
        GetMenuIntentHandler,
        GetOrderIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();