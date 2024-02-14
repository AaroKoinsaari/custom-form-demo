# Introduction

This project a demo task for Startup Greece 2nd round of recruiting process. It is built using Node.js and Express and allows users to dynamically add, edit, and remove form fields. The form data is saved in a JSON file on the server. Follow these instructions to get the application running on your local machine.

## Prerequisites

Make sure you have the following installed:
- Node.js (download and install from [nodejs.org](https://nodejs.org/))
- npm (comes installed with Node.js)

## Installation

1. **Clone the repository**

   Clone the repository to your local machine using Git.

   ```sh
   git clone https://github.com/AaroKoinsaari/custom-form-demo.git
   ```

2. **Navigate to the project directory**

   ```sh
   cd path/to/project
   ```

3. **Install dependencies**

    Run the following command to install the necessary Node.js dependencies defined in package.json.

   ```sh
   npm install
   ```

## Running the Server

1. **Start the server**

    Run the server using following command.

    ```sh
    node server.js
    ```

2. **Access the appliation**

    Open a web browser and navigate to `http://localhost:3000`. You should see the application now running.

## Usage

- **Add Fields:** Click on "Add Text Field" or "Add Select Field" to add new custom form fields.
- **Edit Headers:** Click on any field header to edit its text.
- **Remove Fields:** Click the "X" button next to a field to remove it.
- **Save Data:** Click "Save Data" to submit the form. The data will be saved in `data.json` in the project directory.
