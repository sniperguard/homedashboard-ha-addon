ARG BUILD_FROM
FROM $BUILD_FROM

# Install Node.js
RUN apk add --no-cache nodejs npm

# Create app directory
WORKDIR /app

# Copy relay client source
COPY rootfs/app/ /app/

# Install dependencies
RUN npm install --production

# Copy run script
COPY rootfs/run.sh /run.sh
RUN chmod +x /run.sh

CMD [ "/run.sh" ]
