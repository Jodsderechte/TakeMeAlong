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
/*
		@GET
		public Response ConvertLocation(@QueryParam("streetNr")String streetNr, @QueryParam("street")String street, @QueryParam("postalcode")String zip, @QueryParam("city")String city, @QueryParam("country")String country) {
			String query = "street=" + streetNr + "%20" + street + "&";
		    query += "postalcode=" + zip + "&";
		    query += "country=" + country + "&";
		    query += "city=" + city;
		    		
			String path = "/search?" + query + "&format=json";
			String uri = "https://nominatim.openstreetmap.org" + path;
			System.out.println(uri);
			HttpClient client = HttpClient.newHttpClient();
		    HttpRequest httpHequest = HttpRequest.newBuilder()
		          .uri(URI.create(uri))
		          .header("Accept","application/json")
		          .GET()
		          .build();
		    
		    HttpResponse<String> httpResponse;
			try {
				httpResponse = client.send(httpHequest, BodyHandlers.ofString());
				System.out.println( httpResponse.body().toString() );
				StringBuilder strBuilder = new StringBuilder();
				strBuilder.append("{");
				Gson gson = new Gson();
				JsonArray objArray = gson.fromJson(httpResponse.body().toString(), JsonArray.class );
				
				for( int i=0; i < objArray.size(); i++)
				{
					if(objArray.get(i).isJsonObject() )
					{
						strBuilder.append("\"lat\" : " + objArray.get(i).getAsJsonObject().get("lat"));
						strBuilder.append(", ");
						strBuilder.append("\"lon\" : " + objArray.get(i).getAsJsonObject().get("lon"));
						strBuilder.append(", ");
						strBuilder.append("\"name\" : " + objArray.get(i).getAsJsonObject().get("display_name") );
						break;
					}
				}
				
				strBuilder.append("}");
				 return Response.ok().entity(strBuilder.toString()).type("application/json").build();
				
				//System.out.println( strBuilder );
				
			} catch (Exception e) {
				e.printStackTrace();
				return Response.status(404).build();
				
			}
			
}*/
}