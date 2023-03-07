# WatchTogether

  Node.js v18.14.0
  Visit https://nodejs.org/ru/download/
 
## Libraries Enviroment
  npm install bcryptjs express jsonwebtoken mysql uuid cors
  <p>
  npm i bootstrap-icons
  <p>
  npm i bootstrap
  <p>
  npm i dotenv
  <p>
  npm i -g now (Terminal: now) 
    ![image](https://user-images.githubusercontent.com/75362788/223366761-122fe53e-1084-4d47-8a78-f977df1c998f.png)
    ![image](https://user-images.githubusercontent.com/75362788/223366979-4e2a1aeb-846a-4cfe-b668-86b42b302dc6.png)
  <p>
  npm i -g vercel (Terminal: vercel) 
  ![image](https://user-images.githubusercontent.com/75362788/223367720-2f7b3d86-bc41-4e3e-98d7-6abf4921ad9c.png)

## mysql server Open Server Panel
  Visit https://ospanel.io/
  
  > SQL Export table
  
  <details><summary>Import text SQL</summary>
  <p>
    
  ```sql
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Мар 03 2023 г., 04:25
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `node-jwt`
--

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `registered` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `registered`, `last_login`) VALUES
('7bd16fe1-0a47-4ef2-8325-8901147aefe6', 'test@test.ru', '$2a$10$g2P15.aYZa98E8SBNi6YgO1ghpQyZR0X81U8y8u27gTfLoJ.sqYwe', '2023-03-03 02:09:10', '2023-03-03 03:11:38');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
```
 </p>
</details>

# API
  
  > 🛣️ /api/signin POST
  <details><summary>body</summary>
  <p>
    
  ```json
  {
    "login" : "test@test.ru",
    "password" : "123123"
  }
  ```
    
  </p>
  </details>
  
   <details><summary>response</summary>
  <p>
    
  ```json
 {
    "msg": "Logged in!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3RAdGVzdC5ydSIsInVzZXJJZCI6IjdiZDE2ZmUxLTBhNDctNGVmMi04MzI1LTg5MDExNDdhZWZlNiIsImlhdCI6MTY3Nzc5ODU3OSwiZXhwIjoxNjc4NDAzMzc5fQ.WwfHbWeF-Y6mvzNFLrgVKbW_C5lgMbVZOpUVBg8CrCs",
    "user": {
        "id": "7bd16fe1-0a47-4ef2-8325-8901147aefe6",
        "login": "test@test.ru",
        "password": "$2a$10$g2P15.aYZa98E8SBNi6YgO1ghpQyZR0X81U8y8u27gTfLoJ.sqYwe",
        "registered": "2023-03-02T23:09:10.000Z",
        "last_login": "2023-03-02T23:09:10.000Z"
    }
}
  ```
    
  </p>
  </details>
  
   > 🛣️ #/api/signup POST
  <details><summary>body</summary>
  <p>
    
  ```json
  {
    "login" : "test@test.ru",
    "password" : "123123",
    "password_repeat" : "123123"
  }
  ```
    
  </p>
  </details>
  
  <details><summary>response</summary>
  <p>
    
  ```json
  {
    "msg": "Registered!"
  }
  ```
    
  </p>
  </details>

 
/// to be continued ..)
