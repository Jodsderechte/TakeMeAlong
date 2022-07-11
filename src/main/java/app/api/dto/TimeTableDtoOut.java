
package app.api.dto;

import java.io.Serializable;
import java.sql.Time;

import app.model.TimeTable_Weekday;
import app.model.User;

@SuppressWarnings("serial")
public class TimeTableDtoOut implements Serializable {
	private int user_id;
	private int weekday;
	private Time start_Time;
	private Time end_time;
	
	public TimeTableDtoOut(){}
	
	
	public TimeTableDtoOut(TimeTable_Weekday timetable) {
		this.user_id = timetable.getUserId();
		this.weekday = timetable.getWeekday();
		this.start_Time = timetable.getStart_time();
		this.end_time = timetable.getEnd_time();
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public int getWeekday() {
		return weekday;
	}
	public void setWeekday(int weekday) {
		this.weekday = weekday;
	}


	public String getStart_Time() {
		return start_Time.toLocalTime().getHour()+":"+start_Time.toLocalTime().getMinute();
	}


	public void setStart_Time(Time start_Time) {
		this.start_Time = start_Time;
	}


	public String getEnd_time() {
		return end_time.toLocalTime().getHour()+":"+end_time.toLocalTime().getMinute();
	}


	public void setEnd_time(Time end_time) {
		this.end_time = end_time;
	}

	
	
}