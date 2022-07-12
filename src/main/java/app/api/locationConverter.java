package app.api;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonArray;

@Path("/location")
@Produces(MediaType.APPLICATION_JSON)
public class locationConverter {

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
			
}
}