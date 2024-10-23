
# Goth Girl Image Server 🎃🖤

This is a **Node.js** server that serves hot, random goth girl images. The server is hosted on **Amazon AWS** via **EC2**, and users can access the images via an **API** using an **access token** for authentication.

## Features

- 🔑 **Access Token Authentication**: Secure your API endpoints with an access token.
- 📸 **Random Goth Girl Images**: Fetch random goth girl images on request.
- 🚀 **AWS EC2 Deployment**: Server hosted using AWS EC2 for scalable and reliable uptime.

## Tech Stack

- **Node.js**: Backend server built on Node.js for efficient and fast responses.
- **Express.js**: Handles the API routing and requests.
- **AWS EC2**: Deployment platform to host the server.
- **S3**: (Optional) Store or manage image assets in Amazon S3.
- **Access Tokens**: Secure access to the API endpoints using token-based authentication.

## API Endpoints

### `GET https://go.th/get` (todo: reserve domain)

Returns a random goth girl image.

#### Request

```bash
GET go.th/get
Authorization: Bearer <ACCESS_TOKEN>
```

#### Response

- **200 OK**: Returns the image
- **401 Unauthorized**: Invalid or missing access token.

## How to Use

### 1. Clone the Repo

```bash
git clone https://github.com/tetsuguy/gaas.git
cd gaas
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of your project to store environment variables:

```bash
PORT=3000
API_KEY=yourPersonalKey
```

### 4. Start the Server

```bash
npm start
```

The server should now be running on [http://localhost:3000](http://localhost:3000).

### 5. Access the API

Make a request to the API with a valid access token.

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/get
```

## Contributing

Feel free to fork the repository and submit pull requests for new features, bug fixes, or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enjoy your random goth girl images!** 🎃🖤
