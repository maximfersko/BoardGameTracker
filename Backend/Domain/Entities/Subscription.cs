using System;
using BoardGamesTracker.Domain.Enums;

namespace Domain.Entities;

public class Subscription
{
    public Guid Id { get; set; }

    public Guid FollowerId { get; set; }
    public User Follower { get; set; }

    public Guid FollowingId { get; set; }
    public User Following { get; set; }

    public SubscriptionStatus Status { get; set; }
    public DateTime SubscriptionAt { get; set; }
}