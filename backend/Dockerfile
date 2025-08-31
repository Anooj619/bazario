# Step 1: Use .NET 8 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["bazario-api.csproj", "./"]
RUN dotnet restore "bazario-api.csproj"

# Copy the rest of the code and publish
COPY . .
RUN dotnet publish "bazario-api.csproj" -c Release -o /app/publish

# Step 2: Use .NET 8 runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Make sure the app listens on the port Render gives
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}

# Run your app
CMD ["dotnet", "bazario-api.dll"]
