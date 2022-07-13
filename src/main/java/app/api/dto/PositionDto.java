package app.api.dto;

import java.io.Serializable;

import app.model.Position;
import app.model.User;


@SuppressWarnings("serial")
public class PositionDto implements Serializable {
	private double lon	;
    private double lat;
	public double getLon() {
		return lon;
	}
	public void setLon(double longitude) {
		this.lon = longitude;
	}
	public double getLat() {
		return lat;
	}
	public void setLat(double latitude) {
		this.lat = latitude;
	}
	public PositionDto(Position position) {
		this.lon = position.getLongitude();
		this.lat = position.getLatitude();
	}
	public PositionDto() {
		
	}
    
	
	
}
