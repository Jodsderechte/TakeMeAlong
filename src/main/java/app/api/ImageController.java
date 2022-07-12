package app.api;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import app.api.access.AccessManager;
import app.api.dto.ImageDto;
import app.api.dto.LoginDto;
import app.api.dto.Token;
import app.api.dto.UserDtoIn;
import app.api.dto.UserDtoOut;
import app.dao.ImageDAO;
import app.dao.UserDAO;
import app.model.Image;
import app.model.User;


@Path("/image")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ImageController {

	@Inject
	private UserDAO userDAO;
	@Inject
	private ImageDAO imageDAO;
	
	@Inject
	private AccessManager accessManager;
	

    @GET
	public Response getOwnImage(@QueryParam("token") UUID uuid) 
	{
		if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
		Optional<User> user =accessManager.getUser(uuid);
		if(user.isPresent()) {
		Optional<Image> Bild = imageDAO.getImage(user.get().getUserId());
		
		 try {
	            if (Bild.isPresent()) {
	                return Response.ok().entity(Bild.get().getImage_data()).type("image/jpeg").build();
	            } else {
	            	throw new RuntimeException("ERROR: Image not found");
	            }
	        } catch (Exception e) {
	            System.out.println("ERROR " + e.getMessage());
	            return Response.status(404).build();
	        }
		}else	throw new RuntimeException("ERROR: User for Image not found");
}
    
    @Path("/user/{userId}")
    @GET
	public Response getImageforUser(@PathParam("userId") int userId,@QueryParam("token") UUID uuid) 
	{
		if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
		Optional<User> user = userDAO.findUser(userId);
		if(user.isPresent()) {
		Optional<Image> Bild = imageDAO.getImage(user.get().getUserId());
		
		 try {
	            if (Bild.isPresent()) {
	                return Response.ok().entity(Bild.get().getImage_data()).type("image/jpeg").build();
	            } else {
	            	throw new RuntimeException("ERROR: Image not found");
	            }
	        } catch (Exception e) {
	            System.out.println("ERROR " + e.getMessage());
	            return Response.status(404).build();
	        }
		}else	throw new RuntimeException("ERROR: User for Image not found");
}
        
    
    
    
    
    @GET
    @Path("/{imageId}")
	public Response getImagebyID(@PathParam("imageId") int imageId, @QueryParam("token") UUID uuid) 
	{
    	System.out.println("getImagebyImageID"+imageId);
    	if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
    	Optional<Image> Bild = imageDAO.getImagebyId(imageId);
		
		 try {
	            if (Bild.isPresent()) {
	                return Response.ok().entity(Bild.get().getImage_data()).type("image/jpeg").build();
	            } else {
	            	throw new RuntimeException("ERROR: Image not found");
	            }
		 } catch (Exception e) {
	            System.out.println("ERROR " + e.getMessage());
	            return Response.status(404).build();
	        }
	}
    @Transactional
    @POST
    @Consumes({"image/jpeg"})
    @Produces (MediaType. APPLICATION_JSON)
   	public Response addImage( InputStream inputStream) 
   	{
    	// no check if User has Access due to ease of use - Security risk
		byte[] content;
		try {
			content = inputStream.readAllBytes();
			int imageId = imageDAO.addImage(content);
			System.out.println(imageId);
	    	return Response.ok().entity(imageId).build();
		} catch (IOException e) {
			System.out.println("ERROR "+e.getMessage());
		 return Response.status(404).build();
		}
   	}
  
}