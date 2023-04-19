# azure-signalr-aspnet6-reactjs
An asp.net 6 with react.js template using azure signalR to move a black square on screen POC

To run this app:

## Create Azure SignalR Service

- Go to Azure portal
- Create new resource
- Search for SignalR Service
- Follow wizard and fill in details
  - For Pricing Tier - select Free
  - For Service mode select `Default`
- Create Resource
- Once resource is created
  - Copy your connection string with format => `Endpoint=https://<signalR_Instance>.service.signalr.net;AccessKey=<Access_Key>;Version=1.0;`
  - Connection string is on left sid of blade under `Settings => Keys` (Or `Settings => Connectionstrings`)

## Start Application

- Take the copied connection string and paste it into `Appsettings` under `Azure:SignalR:ConnectionString`
  - Ideally for prod code this should be read from Azure Keyvault
  - For development use dotnet secrets
  - For POC it doesn't really matter, just remember to not check in connectionstring or delete Azure resource or recycle keys if you do
 - Run application
   - It might have to warm up first 😁😜
   
 ## The Code
 
 The main parts to have a look at are the following classes, or components.
 
### Nuget

[Microsoft.Azure.SignalR](https://www.nuget.org/packages/Microsoft.Azure.SignalR/1.21.2?_src=template)

[Microsoft.Azure.SignalR.Management](https://www.nuget.org/packages/Microsoft.Azure.SignalR.Management/1.21.2?_src=template)

### NPM
[@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr)

### C#

- `program.cs` => 

```C#

builder.Services.AddSignalR().AddAzureSignalR();

///Add endpoints.MapHub
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<MoveSquareHub>("/move");
    endpoints.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
});

```
- `MoveSquareHub.cs` => The created hub under namespace `Hubs`

### Javascript

- `setupProxy.js`
- `BlackSquare.js` with `Square` component
  - For this part the main signalr components are
  
  ```js
  
      useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl("/move", {
                negotiateVersion: 2,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);
    
    useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                console.log("SignalR connection established.");


                connection.on("move", (x, y) => {
                    console.log("Received new position:", x, y);
                    setPosition({ x, y });
                });
            }).catch((err) => console.error(err));
        }
    }, [connection]);
    
    connection.send("move", x, y);
  ```
  
- `App.js` calling the square component
