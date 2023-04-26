using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using System.Diagnostics;

namespace BlackSquare.Hubs
{
    public class MoveSquareHub : Hub
    {
        public async Task Move(int x, int y, string id)
        {
            try
            {
                Debug.WriteLine($"Connection with Id: {Context.ConnectionId} was made");
                await Groups.AddToGroupAsync(Context.ConnectionId, id);
                await Clients.Groups(id).SendAsync("move", x, y).ContinueWith(task =>
                {
                    if (task.IsFaulted)
                    {
                        Debug.WriteLine("Message not sent");
                    }
                    else
                    {
                        Debug.WriteLine($"Message sent with new values X:{x} and Y:{y}");
                    }
                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                throw;
            }
        }
    }
}
