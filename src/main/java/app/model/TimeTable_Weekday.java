package app.model;

import java.io.Serializable;
import java.sql.Time;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@IdClass(TimeTableID.class)
@Table(name = "timetable_weekday")
@NamedQueries({ 
	@NamedQuery(name = "timetable_weekday.findAll", query = "SELECT t FROM timetable_weekday t"),
	@NamedQuery(name = "timetable_weekday.findByUserId", query = "SELECT t FROM timetable_weekday t WHERE t.user_id = :user_id and t.weekday =:weekday") })

@SuppressWarnings("serial")
public class TimeTable_Weekday implements Serializable {
		@Id
	 	@Column(name = "user_id", nullable = false)
	    private Integer userId;
		@Id
		@Column(name = "weekday", nullable = false)
	    private Integer weekday;
		
		@Column(name = "start_time", nullable = false)
	    private Time start_time;
		
		@Column(name = "end_time", nullable = false)
	    private Time end_time;

		public Integer getUserId() {
			return userId;
		}

		public void setUserId(Integer userId) {
			this.userId = userId;
		}

		public Integer getWeekday() {
			return weekday;
		}

		public void setWeekday(Integer weekday) {
			this.weekday = weekday;
		}

		public Time getStart_time() {
			return start_time;
		}

		public void setStart_time(Time start_time) {
			this.start_time = start_time;
		}

		public Time getEnd_time() {
			return end_time;
		}

		public void setEnd_time(Time end_time) {
			this.end_time = end_time;
		}

		@Override
		public int hashCode() {
			return Objects.hash(userId, weekday);
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			TimeTable_Weekday other = (TimeTable_Weekday) obj;
			return Objects.equals(userId, other.userId) && Objects.equals(weekday, other.weekday);
		}

		
}

