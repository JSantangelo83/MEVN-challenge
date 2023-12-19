# Installation

## Clone repository (SSH)

```bash
git clone git@github.com:JSantangelo83/MEVN-Challenge.git
```

## Clone repository (HTTPS)

```bash
git clone https://github.com/JSantangelo83/MEVN-Challenge.git
```
## Docker installation

```bash
cd MEVN-Challenge/
docker-compose up --build -d
curl http://localhost:8080/ # Should response with "MEVN Challenge"
```
After that it should be a running website on `http://localhost:8080`

## Manual installation

### Database setup

#### Create MySQL database

```sql
CREATE DATABASE `mevn_challenge` CHARACTER SET utf8 COLLATE utf8_general_ci;
```

#### Create MySQL user

```sql
CREATE USER 'root'@'localhost' IDENTIFIED BY '';
```

#### Grant privileges

```sql
GRANT ALL PRIVILEGES ON `mevn_challenge`.* TO 'root'@'localhost';
```

### Server setup

#### Install dependencies

```bash
cd MEVN-Challenge/server
npm install
```

#### Run server's tests

```bash
npm run test
```

#### Run server

```bash
npm run dev
```
### Webapp's setup
#### Install dependencies
```bash
cd MEVN-Challenge/webapp
npm install
```
#### Run webapp
```bash
npm run dev
```
After that it should be a running website on `http://localhost:5173`

### Initial credentials

#### By default, the server will create an admin user with the following credentials:

```json
{
  "user": "admin",
  "password": "admin"
}
```
