package app.model;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Id;

@SuppressWarnings("serial")
public class TimeTableID implements Serializable {
		private int user_id;
		private int weekday;

		public TimeTableID(int user_id, int weekday) {
			super();
			this.user_id = user_id;
			this.weekday = weekday;
		}

		@Override
		public int hashCode() {
			return Objects.hash(user_id, weekday);
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			TimeTableID other = (TimeTableID) obj;
			return user_id == other.user_id && weekday == other.weekday;
		}

	   
	}
