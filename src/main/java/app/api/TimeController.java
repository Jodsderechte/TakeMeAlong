package app.api;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import app.api.access.AccessManager;
import app.api.dto.TimeTableDto;
import app.api.dto.TimeTableDtoOut;
import app.api.dto.UserDtoOut;
import app.dao.ImageDAO;
import app.dao.TimeTableDAO;
import app.dao.UserDAO;
import app.model.Image;
import app.model.TimeTable_Weekday;
import app.model.User;

@Path("/time")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TimeController {

	@Inject
	private TimeTableDAO timeTableDAO;
	
	@Inject
	private AccessManager accessManager;
	
	@GET
	public TimeTableDtoOut getTimetableforWeekDay(@QueryParam("userId") int userId, @QueryParam("weekday") int weekday, @QueryParam("token") UUID uuid) 
	{
    	if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
    	Optional<TimeTable_Weekday> result;
    	result = timeTableDAO.getTimeTableforUser(userId,weekday);
    	if(result.isPresent()) {
    		TimeTableDtoOut resultout = new TimeTableDtoOut(result.get());
    		return resultout;
    		}
    	else
    		    throw new RuntimeException("ERROR: TimeTable for Weekday not found");


}
	
	
	 @GET
	    @Path("/{userId}")
		public List<TimeTableDtoOut> getTimetableforWeek(@PathParam("userId") int userId, @QueryParam("token") UUID uuid) 
		{
	    	if( accessManager.hasAccess(uuid) == false )
			{
				throw new RuntimeException("ERROR: Access not granted");
			}
	    	
	    	List<TimeTable_Weekday> result = new ArrayList<TimeTable_Weekday>();
			for(int i=1; i<8; i++) {
				if(timeTableDAO.getTimeTableforUser(userId, i).isPresent()) {
				result.add(timeTableDAO.getTimeTableforUser(userId, i).get());}
			}
			return result.stream().map( TimeTableDtoOut::new ).collect(Collectors.toList() );	


}
	 
	 @POST
		@Transactional
		public void addTimeTableforWeekday(@QueryParam("token") UUID uuid, TimeTableDto TimeTable) 
		{
		 		if( accessManager.hasAccess(uuid) == false )
		 			{
		 				throw new RuntimeException("ERROR: Access not granted");
		 			}
	    timeTableDAO.addTimeTable(TimeTable.getUser_id(), TimeTable.getWeekday(), TimeTable.getStart_Time(), TimeTable.getEnd_time());
			
			


}
}