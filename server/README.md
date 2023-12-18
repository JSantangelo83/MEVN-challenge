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
docker-compose up
```

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
cd MEVN-Challenge/
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