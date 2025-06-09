FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy project files first for better layer caching
COPY Backend/BoardGamesTrackerApi/BoardGamesTrackerApi/BoardGamesTrackerApi.csproj \
     Backend/BoardGamesTrackerApi/BoardGamesTrackerApi/
COPY Backend/Infrastructure/Infrastructure.csproj \
     Backend/Infrastructure/
COPY Backend/Domain/Domain.csproj \
     Backend/Domain/

# Install dotnet-ef as a local tool
RUN dotnet new tool-manifest && \
    dotnet tool install dotnet-ef --version 8.0.16

# Restore all projects
RUN dotnet restore Backend/BoardGamesTrackerApi/BoardGamesTrackerApi/BoardGamesTrackerApi.csproj

# Copy remaining files
COPY Backend Backend

# Build the project
RUN dotnet build Backend/BoardGamesTrackerApi/BoardGamesTrackerApi/BoardGamesTrackerApi.csproj -c Release -o /app/build

# Set the entrypoint to use the local tool
ENTRYPOINT ["dotnet", "ef"]