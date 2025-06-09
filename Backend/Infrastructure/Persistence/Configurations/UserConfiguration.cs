using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasMany(u => u.Following)
            .WithOne(s => s.Follower)
            .HasForeignKey(s => s.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.Followers)
            .WithOne(s => s.Following)
            .HasForeignKey(s => s.FollowingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.Collections)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId);

        builder.HasMany(u => u.GameSessions)
            .WithOne(gs => gs.CreatedBy)
            .HasForeignKey(gs => gs.CreatedById);

        builder.HasMany(u => u.Notifications)
            .WithOne(n => n.User)
            .HasForeignKey(n => n.UserId);
    }
}