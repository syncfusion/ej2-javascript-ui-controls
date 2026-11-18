import { CustomFormTemplate } from "./model/base";

/** @private */
export const defaultTemplates: CustomFormTemplate[] = [
    {
        id: 'loginForm',
        title: 'Login Form',
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    title: 'Email Address',
                    name: 'emailAddress',
                    description: 'Enter your email',
                    format: 'email'
                },
                password: {
                    type: 'string',
                    title: 'Password',
                    name: 'password',
                    description: 'Enter your password',
                    minLength: 6
                },
                rememberMe: {
                    type: 'boolean',
                    title: 'Remember Me',
                    name: 'remember',
                    default: false
                }
            },
            required: ['email', 'password']
        }
    },
    {
        id: 'registrationForm',
        title: 'User Registration',
        schema: {
            "version": "0.1.0",
            "properties": {
                "firstName": {
                    "id": "textbox_1780395123369_348",
                    "type": "string",
                    "label": "First Name",
                    "name": 'firstName',
                    "minLength": 2,
                    "widget": "textbox"
                },
                "lastName": {
                    "id": "textbox_1780395123369_714",
                    "type": "string",
                    "label": "Last Name",
                    "name": 'lastName',
                    "minLength": 2,
                    "widget": "textbox"
                },
                "emailAddress": {
                    "id": "textbox_1780395123369_215",
                    "type": "string",
                    "label": "Email Address",
                    "name": 'emailAddress',
                    "textboxType": "email",
                    "widget": "textbox"
                },
                "password": {
                    "id": "textbox_1780395123369_201",
                    "name": "password_1",
                    "type": "string",
                    "label": "Password",
                    "textboxType": "password",
                    "minLength": 8,
                    "widget": "textbox"
                },
                "confirmPassword": {
                    "id": "textbox_1780395123369_608",
                    "name": "password_2",
                    "type": "string",
                    "label": "Confirm Password",
                    "textboxType": "password",
                    "minLength": 8,
                    "widget": "textbox",
                    "customValidation": [
                        {
                            "expression": "valid = (input === {password_1}) ? true : 'Confirm password should match the password'"
                        }
                    ]
                },
                "iAgreeToTheTermsAndConditions": {
                    "id": "checkbox_1780395123369_384",
                    "name": "agree",
                    "type": "boolean",
                    "label": "I agree to the Terms and Conditions",
                    "widget": "checkbox"
                },
                "submit": {
                    "id": "submit_button_initial",
                    "type": "button",
                    "name": "default_submit",
                    "label": "Submit",
                    "buttonType": "submit",
                    "widget": "button",
                    "style": "primary",
                    "disabled": false
                }
            },
            "layout": [
                {
                    "type": "field",
                    "propertyId": "firstName"
                },
                {
                    "type": "field",
                    "propertyId": "lastName"
                },
                {
                    "type": "field",
                    "propertyId": "emailAddress"
                },
                {
                    "type": "field",
                    "propertyId": "password"
                },
                {
                    "type": "field",
                    "propertyId": "confirmPassword"
                },
                {
                    "type": "field",
                    "propertyId": "iAgreeToTheTermsAndConditions"
                },
                {
                    "type": "field",
                    "propertyId": "submit"
                }
            ],
            "settings": {
                "name": "Untitled Form"
            }
        }
    },
    {
        id: 'feedbackSurvey',
        title: 'Feedback Survey',
        schema: {
            "version": "1.0",
            "properties": {
                "howSatisfiedAreYou": {
                    "id": "dropdown_1774507299146_461",
                    "type": "string",
                    "name": "satisfaction",
                    "label": "How satisfied are you?",
                    "options": [
                        "very_satisfied",
                        "satisfied",
                        "neutral",
                        "dissatisfied",
                        "very_dissatisfied"
                    ]
                },
                "wouldYouRecommendUs": {
                    "id": "dropdown_1774507299146_513",
                    "type": "string",
                    "name": "recommendation",
                    "label": "Would you recommend us?",
                    "options": [
                        "yes",
                        "maybe",
                        "no"
                    ]
                },
                "additionalFeedback": {
                    "id": "textarea_1774507317278_373",
                    "type": "string",
                    "name": "feedback",
                    "label": "Additional Feedback"
                },
                "submit": {
                    "id": "button_1774507299146_562",
                    "type": "button",
                    "name": "default_submit",
                    "label": "Submit",
                    "buttonType": "submit"
                }
            }
        }
    }
];

export default defaultTemplates;
