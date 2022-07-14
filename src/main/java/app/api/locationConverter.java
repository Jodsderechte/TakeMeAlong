package app.api;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.Optional;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonArray;

import app.api.access.AccessManager;
import app.api.dto.PositionDto;
import app.api.dto.TimeTableDtoOut;
import app.api.dto.UserDtoOut;
import app.dao.UserDAO;
import app.geocode.GeoCoderImpl;
import app.model.Position;
import app.model.User;

@Path("/location")
@Produces(MediaType.APPLICATION_JSON)
public class locationConverter {

	@Inject
	private AccessManager accessManager;
	@Inject
	private UserDAO userDAO;
	@Inject
	private GeoCoderImpl geocode;
	
	 	@GET
		public PositionDto getLocationforUser(@QueryParam("streetNr")String streetNr, @QueryParam("street")String street, @QueryParam("postalcode")String zip, @QueryParam("city")String city, @QueryParam("country")String country) 
		{	
		 	Optional<Position> result = geocode.geocode(street, streetNr, zip, city, country);
		 	
		 	if(result.isPresent()) {
	    		PositionDto resultout = new PositionDto(result.get());
	    		return resultout;
	    		}
	    	else
	    		    throw new RuntimeException("ERROR: Position not found");


		 
		}
}