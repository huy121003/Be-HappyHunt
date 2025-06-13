# 1. Sử dụng Node.js base image
FROM node:20

# 2. Đặt thư mục làm việc trong container
WORKDIR /app

# 3. Copy file package.json vào container
COPY package*.json ./

# 4. Cài đặt dependencies
RUN yarn  install 

# 5. Copy toàn bộ source code vào container
COPY . .

# 6. Expose cổng mà backend sử dụng (ví dụ: 3000)
EXPOSE 8000

# 7. Câu lệnh chạy BE
CMD ["yarn", "start"]

# docker build -t be-happyhunt .