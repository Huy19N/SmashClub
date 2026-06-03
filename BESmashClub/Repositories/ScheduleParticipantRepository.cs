using Entites.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Base;
using Repositories.Context;

namespace Repositories;

public class ScheduleParticipantRepository : GenericRepository<ScheduleParticipant>
{
    public ScheduleParticipantRepository(SmashClubContext context) : base(context) { }

    public async Task<List<ScheduleParticipant>> GetByScheduleIdAsync(Guid scheduleId)
    {
        return await _context.ScheduleParticipants
            .Include(sp => sp.User)
            .Where(sp => sp.ScheduleId == scheduleId)
            .ToListAsync();
    }

    public async Task<ScheduleParticipant?> GetParticipantAsync(Guid scheduleId, Guid userId)
    {
        return await _context.ScheduleParticipants
            .FirstOrDefaultAsync(sp => sp.ScheduleId == scheduleId && sp.UserId == userId);
    }

    public async Task<int> CountByScheduleIdAsync(Guid scheduleId)
    {
        return await _context.ScheduleParticipants
            .CountAsync(sp => sp.ScheduleId == scheduleId);
    }

    /// <summary>
    /// Kiểm tra xem user có bị trùng lịch không.
    /// Trùng lịch = user đã tham gia một Schedule khác mà booking time bị overlap.
    /// </summary>
    public async Task<bool> HasConflictAsync(Guid userId, DateTime startTime, DateTime endTime, Guid? excludeScheduleId = null)
    {
        var query = _context.ScheduleParticipants
            .Include(sp => sp.Schedule)
                .ThenInclude(s => s.Booking)
            .Where(sp => sp.UserId == userId
                && sp.Schedule.Booking.StartTime < endTime
                && sp.Schedule.Booking.EndTime > startTime
                && sp.Schedule.Booking.StatusId != 3); // Exclude cancelled bookings

        if (excludeScheduleId.HasValue)
            query = query.Where(sp => sp.ScheduleId != excludeScheduleId.Value);

        return await query.AnyAsync();
    }
}

