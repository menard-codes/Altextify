# Prototype of the bulk alt text generator

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
CHALLENGE: FINISH THIS IN 1 DAY
- One button in the frontend to toggle the bulk update
- Updates all the alt texts in one click
- Further customizations can come later
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

=======================
MISC
=======================

## Admin API queries/mutations

### Queries

- [x] Get product ids
- [x] Get product images

### Mutations

- [x] Update file alt text

=======================
SERVICES
=======================

## Mailer Service

- [x] Using the Strategy Design Pattern, implement a mailing class that abstracts away all the low-level details of sending mails
    - [x] Console log mailer (test mailer)

## AI Service

Abstracts away instantiation of usage of different AI models

- [x] AI Service
    - [x] Gemini adapter

=======================
FEATURE MODULES
=======================

## AI Alt Text generator module

Using the Admin API and AI Service, this will contain all the logic related to
AI Alt Text Generation. It doesn't update alt text in shopify by itself because it's out of its scope. It's main priority is to generate alt texts and return them.

- [x] Product images bulk generate

## Bulk alt text generation module

- [x] An entire module for background jobs (should be independent with the app but will be coupled with it for now)
    - Uses the AI Alt Text generator module to generate alt texts in bulk
    - Uses Admin API to bulk update generated alt texts of images
    - Uses Mailer Module to send notifications about the Job
    - Mainly used for background jobs executed by the jobs in BullMQ.
