using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string DisplayName { get; set; }
    public DateTime RegisteredAt { get; set; }
    public String Email { get; set; }

    public ICollection<Subscription> Following { get; set; } 
    public ICollection<Subscription> Followers { get; set; } 
    public ICollection<Collection> Collections { get; set; } 
    public ICollection<GameSession> GameSessions { get; set; } 
    public ICollection<Notification> Notifications { get; set; }
}