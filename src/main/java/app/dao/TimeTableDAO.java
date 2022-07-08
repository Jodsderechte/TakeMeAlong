package app.dao;

import java.sql.Time;
import java.util.Optional;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.IdClass;
import javax.persistence.PersistenceContext;

import app.model.Image;
import app.model.TimeTableID;
import app.model.TimeTable_Weekday;
import app.model.User;

@Singleton
@IdClass(TimeTableID.class)
public class TimeTableDAO {

	@PersistenceContext(name = "jpa-unit")
    EntityManager em;
	
	
	public Optional<TimeTable_Weekday> getTimeTableforUser(int user_id, int weekday) {
		TimeTableID tableid = new TimeTableID(user_id,weekday);
		TimeTable_Weekday Timetable= em.find(TimeTable_Weekday.class,tableid);
		if (Timetable != null) {
			return Optional.of(Timetable);
		} else {
			return Optional.empty();
		}
	}
	

	public void addTimeTable(int user_id, int Weekday, Time start_time, Time end_time) {
				TimeTable_Weekday TimeTable = new TimeTable_Weekday();
				TimeTable.setUserId(user_id);
				TimeTable.setWeekday(Weekday);
				TimeTable.setStart_time(start_time);
				TimeTable.setEnd_time(end_time);
				em.persist(TimeTable);
				em.flush();
				em.refresh(TimeTable);
				
	}
}
